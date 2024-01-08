import React from "react";
import { shallow } from "enzyme";
import NationVariableForm from "./NationVariableForm";

describe("NationVariableForm", () => {
  test("matches snapshot", () => {
    const wrapper = shallow(<NationVariableForm />);
    expect(wrapper).toMatchSnapshot();
  });
});
