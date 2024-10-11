from dataclasses import dataclass
from .RequestHandler import RequestHandler

@dataclass
class RequestFactory:
    
    handler: RequestHandler = None
