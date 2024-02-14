import React from "react";
import { shallow } from "enzyme";
import NationPage from "./NationPage";

describe("NationPage", () => {
  test("matches snapshot", () => {
    const wrapper = shallow(<NationPage />);
    expect(wrapper).toMatchSnapshot();
  });
});
