function addColor(color) {
  const inputArray = [
    {
      type: "text",
      text: "Color Name",
      id: "colorName",
      value: color ? color.name : "",
    },
    {
      type: "color",
      text: "Hex Code",
      id: "hexCode",
      value: color ? color.hexCode : "",
    },
    { type: "number", text: "XS", id: "XS", value: color ? color.XS : 0 },
    { type: "number", text: "S", id: "S", value: color ? color.S : 0 },
    { type: "number", text: "M", id: "M", value: color ? color.M : 0 },
    { type: "number", text: "L", id: "L", value: color ? color.L : 0 },
    { type: "number", text: "XL", id: "XL", value: color ? color.XL : 0 },
    { type: "number", text: "XXL", id: "XXL", value: color ? color.XXL : 0 },
  ];

  const colorWrapper = document.createElement("div");
  colorWrapper.setAttribute("class", "color-wrapper");

  for (const input of inputArray) {
    const wrapper = document.createElement("div");
    wrapper.setAttribute("class", "input-wrapper");

    const label = document.createElement("label");
    label.setAttribute("for", input.id);
    label.textContent = input.text;
    wrapper.appendChild(label);

    const inputEl = document.createElement("input");
    inputEl.setAttribute("type", input.type);
    inputEl.setAttribute("name", input.id);
    inputEl.setAttribute("id", input.id);
    inputEl.setAttribute("required", true);
    inputEl.setAttribute("value", input.value);

    if (typeof input.type === "number") inputEl.setAttribute("min", "0");
    wrapper.appendChild(inputEl);

    colorWrapper.appendChild(wrapper);
  }

  const button = document.createElement("button");
  button.setAttribute("class", "delete-color-btn");
  button.addEventListener("click", removeColor);
  colorWrapper.appendChild(button);

  const parentNode = document.getElementById("stock");
  parentNode.appendChild(colorWrapper);
}

function removeColor(e) {
  const colorWrapper = e.target.parentNode;
  colorWrapper.remove();
}
