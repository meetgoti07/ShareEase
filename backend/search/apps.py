from django.apps import AppConfig


class SearchConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'search'

    def ready(self):
            from . import meilisearch_integration
            meilisearch_integration.meilisearch_index.initialize_index()
