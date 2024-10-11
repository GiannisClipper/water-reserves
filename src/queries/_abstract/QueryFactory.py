from dataclasses import dataclass
from .QueryHandler import QueryHandler

@dataclass
class QueryFactory:
    
    handler: QueryHandler = None
