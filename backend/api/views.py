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
