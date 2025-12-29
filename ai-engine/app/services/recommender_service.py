import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

class RecommenderService:
    def __init__(self):
        # Mock Data for Cold Start
        self.mock_places = pd.DataFrame({
            'id': [1, 2, 3, 4, 5],
            'category': ['park', 'cafe', 'park', 'museum', 'cafe'],
            'features': [
                [1, 0, 1], # Park (Nature, Quiet)
                [0, 1, 0], # Cafe (Food)
                [1, 0, 1], # Park
                [0, 0, 1], # Museum (Quiet)
                [0, 1, 0]  # Cafe
            ]
        })
    
    def recommend(self, user_visited_ids: list[int]):
        """
        Simple Content-Based Filtering using Cosine Similarity on features.
        In a real scenario, this would load matrix from DB/Parquet.
        """
        if not user_visited_ids:
             # Cold start: Return popular randoms
            return [1, 2, 3]

        # In a real app, we fetch user vector based on history
        # Here we simulate by averaging features of visited places
        visited_features = []
        for pid in user_visited_ids:
             place = self.mock_places[self.mock_places['id'] == pid]
             if not place.empty:
                 visited_features.append(place['features'].values[0])
        
        if not visited_features:
            return [1, 2, 3]

        user_vector = np.mean(visited_features, axis=0).reshape(1, -1)
        
        # Calculate similarity with all items
        # Stack features properly
        all_features = np.stack(self.mock_places['features'].values)
        similarities = cosine_similarity(user_vector, all_features)
        
        # Get top 3 indices
        similar_indices = similarities[0].argsort()[::-1][:3]
        
        recommended_ids = self.mock_places.iloc[similar_indices]['id'].tolist()
        return recommended_ids

# Global instance
recommender_service = RecommenderService()
