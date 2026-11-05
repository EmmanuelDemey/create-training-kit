package training;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;

class GreeterTest {

  @Test
  void greetsThePersonByName() {
    assertEquals("Hello, Ada!", Greeter.greet("Ada"));
  }

  @Test
  void trimsTheNameItIsGiven() {
    assertEquals("Hello, Ada!", Greeter.greet("  Ada "));
  }

  @Test
  void greetsTheWorldWhenThereIsNoName() {
    assertEquals("Hello, world!", Greeter.greet(""));
  }
}
