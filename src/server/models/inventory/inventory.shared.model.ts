export type ItemTag = TagWithText | TagWithIcon;
export interface TagWithIcon {
  id: string;
  type: "ICON";
  icon: string;
  alt: string;
}
export interface TagWithText {
  id: string;
  type: "TEXT";
  text: string;
}
