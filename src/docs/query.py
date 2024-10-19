from fastapi import Query

timeRangeQuery = Query( 
    description = "Προσδιορισμός χρονικού εύρους αναζήτησης (με τη μορφή ετών, μηνών ή ημ/νιών)",
    openapi_examples = {
        "ex1": {
            "summary": "Με τη μορφή ετών",
            "value": "2000,2024"
        },
        "ex2": {
            "summary": "Με τη μορφή μηνών",
            "value": "2023-10,2024-09"
        },
        "ex3": {
            "summary": "Με τη μορφή ημ/νιών",
            "value": "2024-08-16,2024-09-15"
        },
    }
)

reservoirFilterQuery = Query( 
    description = "Επιλογή συγκεκριμένων ταμιευτήρων (μέσω του id)",
    openapi_examples = {
        "ex1": {
            "summary": "Για έναν ταμιευτήρα",
            "value": "1"
        },
        "ex2": {
            "summary": "Για τρεις ταμιευτήρες ",
            "value": "1,3,4"
        },
    }
)

factoryFilterQuery = Query( 
    description = "Επιλογή συγκεκριμένων μονάδων επεξεργασίας (μέσω του id)",
    openapi_examples = {
        "ex1": {
            "summary": "Για μία μονάδα",
            "value": "1"
        },
        "ex2": {
            "summary": "Για τρεις μνονάδες ",
            "value": "1,3,4"
        },
    }
)

locationFilterQuery = Query( 
    description = "Επιλογή συγκεκριμένων τοποθεσιών μετρήσεων (μέσω του id)",
    openapi_examples = {
        "ex1": {
            "summary": "Για μία τοποθεσία",
            "value": "4"
        },
        "ex2": {
            "summary": "Για τρεις τοποθεσίες ",
            "value": "1,5,8"
        },
    }
)

municipalityFilterQuery = Query( 
    description = "Επιλογή συγκεκριμένων Δήμων (μέσω του id)",
    openapi_examples = {
        "ex1": {
            "summary": "Για έναν Δήμο",
            "value": "9191"
        },
        "ex2": {
            "summary": "Για τρεις Δήμους ",
            "value": "9190,9193, 9197"
        },
    }
)

intervalFilterQuery = Query( 
    description = "Επιλογή περιορισμένου διαστήματος επεξεργασίας",
    openapi_examples = {
        "ex1": {
            "summary": "Από μέσα Ιουλίου μέχρι τέλος Αυγούστου (ΜΜ-ΗΗ,ΜΜ-ΗΗ)",
            "value": "07-16,08-30"
        },
    }
)

reservoirΑggregationQuery = Query( 
    description = "Επιλογή συγκεντρωτικής παρουσίασης ως προς τους ταμιευτήρες",
    openapi_examples = {
        "ex1": {
            "summary": "Σύνολο ημερήσιων αποθεμάτων",
            "value": "sum"
        },
    }
)

factoryΑggregationQuery = Query( 
    description = "Επιλογή συγκεντρωτικής παρουσίασης ως προς τις μονάδες επεξεργασίας",
    openapi_examples = {
        "ex1": {
            "summary": "Σύνολο ημερήσιας παραγωγής νερού",
            "value": "sum"
        },
    }
)

locationΑggregationQuery = Query( 
    description = "Επιλογή συγκεντρωτικής παρουσίασης ως προς τις τοποθεσίες μετρήσεων",
    openapi_examples = {
        "ex1": {
            "summary": "Σύνολο ημερήσιου υετού (μέσες τιμές για τις θερμοκρασίες)",
            "value": "sum"
        },
    }
)

municipalityΑggregationQuery = Query( 
    description = "Επιλογή συγκεντρωτικής παρουσίασης ως προς τους Δήμους",
    openapi_examples = {
        "ex1": {
            "summary": "Σύνολο συμβάντων ημέρας",
            "value": "sum"
        },
    }
)

timeΑggregationQuery = Query( 
    description = "Επιλογή συγκεντρωτικής παρουσίασης ως προς το χρόνο",
    openapi_examples = {
        "ex1": {
            "summary": "Μέση τιμή ανά έτος",
            "value": "year,avg"
        },
        "ex2": {
            "summary": "Μέση τιμή ανά μήνα",
            "value": "month,avg"
        },
        "ex1": {
            "summary": "Συνολική τιμή ανά έτος",
            "value": "year,sum"
        },
        "ex2": {
            "summary": "Συνολική τιμή ανά μήνα",
            "value": "month,sum"
        }
    }
)

yearStartQuery = Query( 
    description = "Επιλογή έναρξης έτους",
    openapi_examples = {
        "ex1": {
            "summary": "Υδρολογικό έτος από 1η Οκτωβρίου",
            "value": "10-01"
        },
    }
)

