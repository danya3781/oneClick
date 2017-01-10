var L = require ( './inspect.js' );

L ( 'message' );
L ( { hallo: 'bye', bye: 'hallo' } );
L ( [ 1, 2, 3, 4, 'wednesday' ] );
L ( new Date () );
L ( function ( hallo ) { return { bye: hallo } } );
L ( 12345 );
L ( 1.234 );
