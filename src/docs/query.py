from fastapi import Query

timeRangeQuery = Query( 
    description = "Time range definition (in the form of years, months or dates)",
    openapi_examples = {
        "ex1": {
            "summary": "In the form of years",
            "value": "2000,2024"
        },
        "ex2": {
            "summary": "In the form of months",
            "value": "2023-10,2024-09"
        },
        "ex3": {
            "summary": "In the form of dates",
            "value": "2024-08-16,2024-09-15"
        },
    }
)

reservoirFilterQuery = Query( 
    description = "Reservoirs selection (using id)",
    openapi_examples = {
        "ex1": {
            "summary": "Selecting all reservoirs (no id)",
            "value": ""
        },
        "ex2": {
            "summary": "Selecting one reservoir",
            "value": "1"
        },
        "ex3": {
            "summary": "Selecting many reservoirs",
            "value": "1,3,4"
        },
    }
)

factoryFilterQuery = Query( 
    description = "Water-treatment plants selection (using id)",
    openapi_examples = {
        "ex1": {
            "summary": "Selecting all plants (no id)",
            "value": ""
        },
        "ex2": {
            "summary": "Selecting one plant",
            "value": "1"
        },
        "ex3": {
            "summary": "Selecting many plants",
            "value": "1,3,4"
        },
    }
)

locationFilterQuery = Query( 
    description = "Measurement locations selection (using id)",
    openapi_examples = {
        "ex1": {
            "summary": "Selecting all locations (no id)",
            "value": ""
        },
        "ex2": {
            "summary": "Selecting one location",
            "value": "4"
        },
        "ex3": {
            "summary": "Selecting many locations",
            "value": "1,5,8"
        },
    }
)

municipalityFilterQuery = Query( 
    description = "Municipalities selection (using id)",
    openapi_examples = {
        "ex1": {
            "summary": "Selecting all municipalities (no id)",
            "value": ""
        },
        "ex2": {
            "summary": "Selecting one municipality",
            "value": "9191"
        },
        "ex2": {
            "summary": "Selecting many municipalities",
            "value": "9190,9193,9197"
        },
    }
)

intervalFilterQuery = Query( 
    description = "Selection of a limited processing period",
    openapi_examples = {
        "ex1": {
            "summary": "From the mid of July until the end of August (ΜΜ-ΗΗ,ΜΜ-ΗΗ)",
            "value": "07-16,08-31"
        },
    }
)

reservoirΑggregationQuery = Query( 
    description = "Option of reservoir-aggregated data processing",
    openapi_examples = {
        "ex1": {
            "summary": "Sum of daily reserves",
            "value": "sum"
        },
    }
)

factoryΑggregationQuery = Query( 
    description = "Option of plant-aggregated data processing",
    openapi_examples = {
        "ex1": {
            "summary": "Sum of daily water production",
            "value": "sum"
        },
    }
)

locationΑggregationQuery = Query( 
    description = "Option of location-aggregated data processing",
    openapi_examples = {
        "ex1": {
            "summary": "Sum of daily precipitations (mean values for the temperatures)",
            "value": "sum"
        },
    }
)

municipalityΑggregationQuery = Query( 
    description = "Option of municipality-aggregated data processing",
    openapi_examples = {
        "ex1": {
            "summary": "Total daily events",
            "value": "sum"
        },
    }
)

timeΑggregationQuery = Query( 
    description = "Option of time-aggregated data processing",
    openapi_examples = {
        "ex1": {
            "summary": "Yearly mean value",
            "value": "year,avg"
        },
        "ex2": {
            "summary": "Monthly mean value",
            "value": "month,avg"
        },
        "ex1": {
            "summary": "Yearly sum value",
            "value": "year,sum"
        },
        "ex2": {
            "summary": "Monthly sum value",
            "value": "month,sum"
        }
    }
)

yearStartQuery = Query( 
    description = "Option of year starting",
    openapi_examples = {
        "ex1": {
            "summary": "Hydrologic year starting at 1st of October",
            "value": "10-01"
        },
    }
)

