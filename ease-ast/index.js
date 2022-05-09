import mount from "./mount.js";


const template = `
  <div>
    <h3 class="test asgfas asfas" id="sada">hello</h3>
    纯文本测试 - isTest
    <ul>
      <li>A</li>
      <li>B</li>
      <li>C</li>
    </ul>
    <div class="vertical">
      <label class="label">
        <span>测试文案 - test</span>
        <input type="checkbox" />
      </label>
      <input type="text" />
      <input type="color" />
    </div>
    <div>end</div>
  </div>
`;

mount({ template });