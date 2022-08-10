const Image = GLOBAL.require("widgets/image");
const ImageButton = GLOBAL.require("widgets/imagebutton");
const Button = GLOBAL.require("widgets/button");

const IMAGE_SIZE = 68; // or 63
const VERTICAL_OFFSET = 160;

export function InventoryButton({
  image,
  position,
  text,
  onClick,
}: {
  image?: string;
  position: number;
  text?: string;
  onClick: (this: void) => void;
}) {
  const button = ImageButton("images/hud.xml", "inv_slot.tex");
  const x = IMAGE_SIZE * (-10 + position);
  button.SetPosition(x, VERTICAL_OFFSET, 0);
  button.SetOnClick(onClick);
  button.MoveToFront();

  if (image) {
    const icon = button.AddChild(
      Image(GLOBAL.GetInventoryItemAtlas(image + ".tex"), `${image}.tex`)
    );
    icon.SetScale(0.8, 0.8, 0.8);
    icon.MoveToFront();
  }

  if (text) {
    const letter = button.AddChild(Button());
    letter.SetText(text);
    letter.SetPosition(5, 0, 0);
    letter.SetFont("stint-ucr");
    letter.SetTextColour(1, 1, 1, 1);
    letter.SetTextFocusColour(1, 1, 1, 1);
    letter.SetTextSize(50);
    letter.MoveToFront();
  }
  return button;
}
