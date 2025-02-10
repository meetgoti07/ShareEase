from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from product.models import Product
import meilisearch

# Initialize Meilisearch client
MEILISEARCH_URL = "http://meilisearch:7700/"  # Make sure it matches your Docker setup
MEILISEARCH_API_KEY = "EQpsOmvVXkfV4VeqBxdgiGf2TkuJtCiX39KZNCMu8ZM"
client = meilisearch.Client(MEILISEARCH_URL, MEILISEARCH_API_KEY)

@receiver(post_save, sender=Product)
def sync_product_on_save(sender, instance, **kwargs):
    """Automatically index product in Meilisearch after saving."""
    client.index("products").add_documents([{
        "id": instance.id,
        "name": instance.name,
        "description": instance.description,
        "price": instance.price,
        "brand": instance.brand,
        "category": instance.category.name if instance.category else None,
    }])

@receiver(post_delete, sender=Product)
def remove_product_from_index(sender, instance, **kwargs):
    """Remove product from Meilisearch when deleted."""
    client.index("products").delete_document(str(instance.id))
