# inspect-log

Inspect simply combines the *eyes* module's *inspect* method with console.log.

If whatever needs to be logged is a String or a Number, *inspect* would normally log nothing but an elipsis. This module tests if the message is a String or a Number, and if it is, uses console.log to log it. Otherwise, it uses inspect (which pretty-prints objects and arrays, and print its entire depth)

That's it!
