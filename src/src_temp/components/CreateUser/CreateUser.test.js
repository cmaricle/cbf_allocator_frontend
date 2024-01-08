import React from "react";
import { shallow } from "enzyme";
import CreateUser from "./CreateUser";

describe("CreateUser", () => {
  test("matches snapshot", () => {
    const wrapper = shallow(<CreateUser />);
    expect(wrapper).toMatchSnapshot();
  });
});
