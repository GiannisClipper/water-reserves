def set_indentation( n: int, text ):
    lines = text.split( '\n' )
    lines = map( lambda l: ' ' * n + l, lines )
    text = '\n'.join( lines )
    return text

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

def no_tones( text ):

    dict = { 
        'Ά': 'Α', 'Έ': 'Ε', 'Ή': 'Η', 'Ί': 'Ι', 'Ό': 'Ο', 'Ύ': 'Υ', 'Ώ': 'Ω', 
        'Ϊ': 'Ι', 'Ϋ': 'Υ',
        'ά': 'α', 'έ': 'ε', 'ή': 'η', 'ί': 'ι', 'ό': 'ο', 'ύ': 'υ', 'ώ': 'ω', 
        'ϊ': 'ι', 'ϋ': 'υ',
    }
    words = text.split()
    for i, word in enumerate( words ):
        letters = list( word )
        letters = list( map( lambda l: dict.get( l ) if dict.get( l ) else l, letters ) )
        words[ i ] = ''.join( letters )

    return ' '.join( words )

def no_vowels( text ):

    dict = { 'Η': 'Ι', 'Υ': 'Ι', 'Ω': 'Ο' }
    words = text.split()
    for i, word in enumerate( words ):
        letters = list( word )
        letters = list( map( lambda l: dict.get( l ) if dict.get( l ) else l, letters ) )
        words[ i ] = ''.join( letters )

    return ' '.join( words )