function make() {
    var args = [].slice.call(arguments); // Take first item
    var func;

    function f() {
        for (var i = 0; i < arguments.length; i++) {
            // Take another item while it not a function
            if (typeof (arguments[i]) != 'function') {
                args.push(arguments[i]);
            } else {
                // Found function
                func = arguments[i];
                break;
            }
        }
        // If function found apply to args, else call function f() again
        return func ? args.reduce(func) : f;
    }
    return f;
}