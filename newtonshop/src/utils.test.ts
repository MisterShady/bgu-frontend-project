import { toPlural, getDataOrFallback, base64ToBlob, getImagesByColor, getImagesByBandStyle } from "./utils";

describe("Utils functions", () => {
  test("toPlural function", () => {
    expect(toPlural("iphone")).toBe("iphones");
    expect(toPlural("ipad")).toBe("ipads");
    expect(toPlural("mac")).toBe("macs");
    expect(toPlural("watch")).toBe("watches");
    expect(toPlural("unknown")).toBe("unknown");
  });

  test("getDataOrFallback function", () => {
    interface TestObj {
      a: number;
      b: number;
      c?: number;
    }
    const obj: TestObj = { a: 1, b: 2 };
    expect(getDataOrFallback(obj, "a", 0)).toBe(1);
    expect(getDataOrFallback(obj, "c", 3)).toBe(3);

    const fallbackObj: TestObj = { a: 0, b: 0, c: 0 };
    expect(getDataOrFallback(null as unknown as TestObj, "a", fallbackObj.a)).toBe(0);
    expect(getDataOrFallback(undefined as unknown as TestObj, "a", fallbackObj.a)).toBe(0);
  });

  test("base64ToBlob function", () => {
    const base64 = "iVBORw0KGgoAAAANSUhEUgAAAAUA";
    const blob = base64ToBlob(base64);
    expect(blob).toBeInstanceOf(Blob);
    expect(blob.type).toBe("image/jpeg");
  });

  test("getImagesByColor function", () => {
    const images = ["image1_red.jpg", "image2_blue.jpg", "image3_red.jpg"];
    expect(getImagesByColor(images, "red")).toEqual(["image1_red.jpg", "image3_red.jpg"]);
    expect(getImagesByColor(images, "blue")).toEqual(["image2_blue.jpg"]);
    expect(getImagesByColor(images, "green")).toEqual([]);
  });

  test("getImagesByBandStyle function", () => {
    const bandStyle = { image: "image.jpg" };
    expect(getImagesByBandStyle(bandStyle)).toBe("image.jpg");
    expect(getImagesByBandStyle({ image: null })).toBeNull();
  });
});
