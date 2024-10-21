import numpy as np
from sklearn.cluster import KMeans

def kmeans_clustering( lst, n_clusters=5 ):

    arr = np.array( lst )
    if len( arr.shape ) == 1:
        # transformation for single dimension arrays
        # np.array([ 1, 2, 3 ]).reshape( -1, 1 ) => np.array([ [1], [2], [3] ])
        arr = arr.reshape( -1, 1 )

    kmeans = KMeans( n_clusters=n_clusters, max_iter=600, random_state=32 )
    kmeans.fit( arr )
    # print( kmeans.cluster_centers )
    # print( kmeans.labels_ )

    centers = list( map( lambda x: np.average( x ), kmeans.cluster_centers_ ) )

    clusters = kmeans.predict( arr )
    clusters = list( map( lambda x: int( x ), clusters ) )
    # print( centers )
    # print( clusters )

    # change cluster to center values, sort centers, change back to cluster values

    clusters = list( map( lambda cl: centers[ cl ], clusters ) )
    centers.sort()
    clusters = list( map( lambda cl: centers.index( cl ), clusters ) )
    # print( centers )
    # print( clusters )

    return centers, clusters
