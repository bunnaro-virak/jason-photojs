let helper = module.exports = {};

helper.thunkify = function (fn, context) {
    assert('function' === typeof fn, 'function required');
    return function () {
        let args = new Array(arguments.length);
        context = context || this;

        for (let i = 0; i < args.length; ++i) {
            args[i] = arguments[i];
        }
        return function (done) {
            let called;
            args.push(function () {
                if (called) {
                    return;
                }
                called = true;
                done.apply(null, arguments);
            });
            try {
                fn.apply(context, args);
            } catch (err) {
                done(err);
            }
        };
    };
};