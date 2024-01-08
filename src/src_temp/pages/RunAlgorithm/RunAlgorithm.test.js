import React from "react";
import { shallow } from "enzyme";
import RunAlgorithm from "./RunAlgorithm";

describe("RunAlgorithm", () => {
  test("matches snapshot", () => {
    const wrapper = shallow(<RunAlgorithm />);
    expect(wrapper).toMatchSnapshot();
  });
});
