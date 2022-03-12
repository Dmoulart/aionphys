## Impulse solver

-> With no gravity : really great. Responses are good. No need for a lot of iterations.
-> With gravity: Responses are good. Need a lot of iterations with gravity to get the body stacking right(at least 10 iterations).

## Arcade solver

-> With gravity: Big problem, with 3 body colliding the velocity is annihilated and the gravity has no effect.
-> No body shaking problem, it is quite accurate.
-> Iterations solve the problem of high velocity collision.
