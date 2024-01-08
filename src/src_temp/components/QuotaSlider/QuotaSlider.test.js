import React from "react";
import { shallow } from "enzyme";
import QuotaSlider from "./QuotaSlider";

describe("QuotaSlider", () => {
  test("matches snapshot", () => {
    const wrapper = shallow(<QuotaSlider />);
    expect(wrapper).toMatchSnapshot();
  });
});
