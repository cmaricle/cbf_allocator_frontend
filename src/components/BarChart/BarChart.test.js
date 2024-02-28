import React from "react";
import { shallow } from "enzyme";
import BarChart from "./BarChart";

describe("BarChart", () => {
  test("matches snapshot", () => {
    const wrapper = shallow(<BarChart />);
    expect(wrapper).toMatchSnapshot();
  });
});
