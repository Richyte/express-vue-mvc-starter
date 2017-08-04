import test from 'ava';
import config from '../app/config';

test('config', t => {
    if (config.env === 'development') {
        t.pass()
    } else {
        t.fail()
    }
})