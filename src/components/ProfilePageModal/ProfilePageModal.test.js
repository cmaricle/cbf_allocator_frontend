import React from "react";
import { shallow } from "enzyme";
import ProfilePageModal from "./ProfilePageModal";

describe("ProfilePageModal", () => {
  test("matches snapshot", () => {
    const wrapper = shallow(<ProfilePageModal />);
    expect(wrapper).toMatchSnapshot();
  });
});
