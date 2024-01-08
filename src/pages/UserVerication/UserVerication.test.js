import React from "react";
import { shallow } from "enzyme";
import UserVerication from "./UserVerication";

describe("UserVerication", () => {
  test("matches snapshot", () => {
    const wrapper = shallow(<UserVerication />);
    expect(wrapper).toMatchSnapshot();
  });
});
