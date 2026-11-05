package training;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

class GreeterTest {

  @Test
  @DisplayName("salue la personne par son prénom")
  void greetsThePersonByName() {
    assertEquals("Bonjour, Ada !", Greeter.greet("Ada"));
  }

  @Test
  @DisplayName("retire les espaces autour du prénom")
  void trimsTheNameItIsGiven() {
    assertEquals("Bonjour, Ada !", Greeter.greet("  Ada "));
  }

  @Test
  @DisplayName("salue tout le monde quand il n'y a pas de prénom")
  void greetsTheWorldWhenThereIsNoName() {
    assertEquals("Bonjour, tout le monde !", Greeter.greet(""));
  }
}
