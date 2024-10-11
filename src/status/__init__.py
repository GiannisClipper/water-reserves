from dataclasses import dataclass

from ._abstract import AbstractStatus

from .savings import SavingsStatus
from .production import ProductionStatus
from .weather import WeatherStatus
from .interruptions import InterruptionsStatus
from .geolocation import GeolocationStatus

@dataclass
class Status( AbstractStatus ):

    savings: SavingsStatus | None
    production: ProductionStatus | None
    weather: WeatherStatus | None
    interruptions: InterruptionsStatus | None
    geolocation: GeolocationStatus | None

    async def update( self ):

        self.savings = SavingsStatus( None, None, None, None )
        await self.savings.update()

        self.production = ProductionStatus( None, None, None, None )
        await self.production.update()

        self.weather = WeatherStatus( None, None, None, None )
        await self.weather.update()

        self.interruptions = InterruptionsStatus( None, None )
        await self.interruptions.update()

        self.geolocation = GeolocationStatus( None )
        await self.geolocation.update()
