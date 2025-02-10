from django.core.management.base import BaseCommand
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from meilisearch import Client
from django.conf import settings
from datetime import datetime
from decimal import Decimal
from product.models import Product

def format_decimal(value):
    if isinstance(value, Decimal):
        return float(value)
    return value

class MeilisearchProductIndex:
    def __init__(self):
        self.client = Client(settings.MEILISEARCH_URL, settings.MEILISEARCH_API_KEY)
        self.index = self.client.index('products')

    def initialize_index(self):
        """Create and configure the products index"""
        try:
            self.client.create_index('products', {'primaryKey': 'id'})
        except Exception:
            # Index might already exist
            pass

        # Configure index settings
        self.index.update_settings({
            'searchableAttributes': [
                'title',
                'description',
                'brand',
                'extra_features'
            ],
            'filterableAttributes': [
                'category',
                'brand',
                'is_ad',
                'is_sold',
                'owner_id',
                'selling_price',
                'mrp'
            ],
            'sortableAttributes': [
                'created_at',
                'updated_at',
                'selling_price',
                'mrp'
            ]
        })

    def product_to_dict(self, product):
        """Convert a Product instance to a Meilisearch document"""
        return {
            'id': str(product.id),
            'title': product.title,
            'description': product.description,
            'owner_id': str(product.owner_id),
            'category': str(product.category_id) if product.category else None,
            'category_name': product.category.name if product.category else None,
            'brand': product.brand,
            'images': product.images.split(',') if product.images else [],
            'quantity': product.quantity,
            'mrp': format_decimal(product.mrp),
            'selling_price': format_decimal(product.selling_price),
            'is_ad': product.is_ad,
            'is_sold': product.is_sold,
            'extra_features': product.extra_features or {},
            'created_at': product.created_at.isoformat() if product.created_at else None,
            'updated_at': product.updated_at.isoformat() if product.updated_at else None
        }

# Initialize Meilisearch index manager
meilisearch_index = MeilisearchProductIndex()

@receiver(post_save, sender=Product)
def update_meilisearch(sender, instance, created, **kwargs):
    """Update or create product document in Meilisearch when a product is saved"""
    try:
        product_data = meilisearch_index.product_to_dict(instance)
        meilisearch_index.index.add_documents([product_data])
    except Exception as e:
        # Log the error but don't break the save operation
        print(f"Meilisearch update error: {e}")

@receiver(post_delete, sender=Product)
def delete_from_meilisearch(sender, instance, **kwargs):
    """Delete product document from Meilisearch when a product is deleted"""
    try:
        meilisearch_index.index.delete_document(str(instance.id))
    except Exception as e:
        # Log the error but don't break the delete operation
        print(f"Meilisearch delete error: {e}")

class SyncMeilisearchCommand(BaseCommand):
    help = 'Sync all products to Meilisearch'

    def handle(self, *args, **kwargs):

        # Initialize index
        meilisearch_index.initialize_index()

        # Get all products
        products = Product.objects.select_related('category').all()

        # Convert to Meilisearch documents
        products_data = [
            meilisearch_index.product_to_dict(product)
            for product in products
        ]

        # Batch add to Meilisearch
        if products_data:
            meilisearch_index.index.add_documents(products_data)
            self.stdout.write(
                self.style.SUCCESS(f'Successfully synced {len(products_data)} products')
            )
        else:
            self.stdout.write(
                self.style.WARNING('No products found to sync')
            )