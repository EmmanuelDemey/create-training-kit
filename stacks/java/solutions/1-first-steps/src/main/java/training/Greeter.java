package training;

public final class Greeter {

  private Greeter() {}

  /** The greeting for {@code name}. */
  public static String greet(String name) {
    String trimmed = name.strip();
    return "Hello, " + (trimmed.isEmpty() ? "world" : trimmed) + "!";
  }
}
