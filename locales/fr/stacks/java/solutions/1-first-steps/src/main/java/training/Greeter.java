package training;

public final class Greeter {

  private Greeter() {}

  /** Le message de bienvenue pour {@code name}. */
  public static String greet(String name) {
    String trimmed = name.strip();
    return "Bonjour, " + (trimmed.isEmpty() ? "tout le monde" : trimmed) + " !";
  }
}
