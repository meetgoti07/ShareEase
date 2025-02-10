from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
import meilisearch
from django.conf import settings

# ✅ Initialize Meilisearch client
client = meilisearch.Client(settings.MEILISEARCH_URL, settings.MEILISEARCH_API_KEY)

class SearchProducts(APIView):
    permission_classes = [IsAuthenticated]  # Ensure only authenticated users can search

    def get(self, request):
        query = request.GET.get("q", "")
        if not query:
            return JsonResponse({"error": "Query parameter 'q' is required."}, status=400)

        try:
            results = client.index("products").search(query, {"limit": 10})

            if not results["hits"]:
                return JsonResponse({"message": "No products found"}, status=200)

            # ✅ Extract only required fields: id, title, and selling_price
            filtered_products = [
                {
                    "id": product["id"],
                    "title": product["title"],
                    "selling_price": product.get("selling_price", 0)  # Default to 0 if price is missing
                }
                for product in results["hits"]
            ]

            return JsonResponse({"products": filtered_products}, safe=False, status=200)

        except meilisearch.errors.MeilisearchApiError as e:
            return JsonResponse({"error": "Meilisearch API error", "details": str(e)}, status=500)

        except Exception as e:
            return JsonResponse({"error": "Internal Server Error", "details": str(e)}, status=500)
