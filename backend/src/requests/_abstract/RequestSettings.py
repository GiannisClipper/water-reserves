from dataclasses import dataclass
from abc import ABC, abstractmethod

@dataclass
class RequestSettings( ABC ):

    params: dict = None
    certification: str = None

    @property
    @abstractmethod
    def url():
        pass # compose the url 

@dataclass
class GetRequestSettings( RequestSettings ):
    pass

@dataclass
class PostRequestSettings( RequestSettings ):

    @property
    @abstractmethod
    def body():
        pass # compose the body
