from dataclasses import dataclass
from abc import ABC, abstractmethod

@dataclass
class ResponseParser( ABC ):

    params: dict = None
    error: str = None
    data: list = None

    @abstractmethod
    def parse_response( self, response ):
        pass # parse the request response 
