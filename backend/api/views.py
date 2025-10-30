from rest_framework.decorators import api_view
from rest_framework.response import Response
from db.mongo import db

collection = db["landing_page_content"]

@api_view(['POST'])
def create_content(request):
    data = request.data
    collection.insert_one(data)
    return Response({"message": "Content added"}, status=201)

@api_view(['GET'])
def get_all_content(request):
    data = list(collection.find({}, {"_id": 0}))
    return Response(data)

@api_view(['PUT'])
def update_content(request):
    try:
        filter_data = request.data.get("filter", {})
        update_data = request.data.get("update")

        if not update_data:
            return Response(
                {"error": "The 'update' field is required."},
                status=400
            )

        # Always match the first document if filter is empty
        result = collection.update_one(filter_data or {}, {"$set": update_data})

        if result.matched_count == 0:
            return Response({"message": "No matching document found."}, status=404)

        return Response({"message": "Content updated successfully."}, status=200)

    except Exception as e:
        return Response({"error": str(e)}, status=500)
