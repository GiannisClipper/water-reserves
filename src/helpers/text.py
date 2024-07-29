def get_query_headers( query ):

    text = ""
    try:
        # isolate the proper part of the query
        text = query.split( 'SELECT' )[ 1 ].split( 'FROM' )[ 0 ].strip();
    except:
        raise ValueError( 'Invalid query string' )

    headers = []
    buffer = ''
    parenth = 0

    for c in text + ',':

        # check parenthesis
        if ( c == '(' ):
            parenth +=1
            buffer = ''
        elif ( c == ')' ):
            parenth -=1

        if parenth > 0:
            continue

        # check other characters
        if ( c in [ ' ', '.' ] ):
            buffer = ''
        elif ( c == ',' ):
            if buffer:
                headers.append( buffer )
                buffer = ''
        else:
            buffer += c

    return headers
