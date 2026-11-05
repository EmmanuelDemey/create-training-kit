# TP 1 — First steps

> Write the method that greets whoever it is given. The tests are already
> written: make them pass, one by one.

## Goal

- Read a failing JUnit test and make it pass
- Work in a test loop with Maven

## Setup

A JDK 21 or newer, and Maven.

```bash
mvn test
```

## Steps

1. In `src/main/java/training/Greeter.java`, return `Hello, <name>!`.
2. Strip the spaces around the name.
3. Greet the world when the name is blank.

## Done when

- `mvn test` passes, all three tests of `GreeterTest` green
