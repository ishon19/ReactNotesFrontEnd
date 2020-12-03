import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render } from "@testing-library/react";
import Note from "./Note";

test("renders contents", () => {
  const note = {
    content: "Component testing is done with react-testing-library",
    important: true,
  };

  const component = render(<Note note={note} />);

  expect(component.container).toHaveTextContent(
    "Component testing is done with react-testing-library"
  );

  const element = component.getByText(
    "Component testing is done with react-testing-library"
  );
  expect(element).toBeDefined();

  const div = component.container.querySelector(".note");
  expect(div).toHaveTextContent(
    "Component testing is done with react-testing-library"
  );
});
