import objectPath from "object-path";
import { useBodyStore } from "@/stores/body";
import { useConfigStore } from "@/stores/config";
import { config } from "@/layouts/default-layout/config/helper";

class LayoutService {
  public static bodyStore: any;
  public static configStore: any;

  /**
   * @description initialize default layout
   */
  public static init(): void {
    this.bodyStore = useBodyStore();
    this.configStore = useConfigStore();

    //empty body element classes and attributes
    LayoutService.emptyElementClassesAndAttributes(document.body);

    LayoutService.initLayout();
    LayoutService.initHeader();
    LayoutService.initToolbar();
    // LayoutService.initAside();
    LayoutService.initSidebar();
    LayoutService.initFooter();
  }

  /**
   * @description init layout
   */
  public static initLayout(): void {
    this.bodyStore.addBodyAttribute({
      qualifiedName: "id",
      value: "kt_body",
    });
  }

  /**
   * @description init header
   */
  public static initHeader(): void {
    if (objectPath.get(config.value, "header.fixed.desktop")) {
      this.bodyStore.addBodyClassname("header-fixed");
    }

    if (objectPath.get(config.value, "header.fixed.tabletAndMobile")) {
      this.bodyStore.addBodyClassname("header-tablet-and-mobile-fixed");
    }
  }

  /**
   * @description init toolbar
   */
  public static initToolbar(): void {
    if (!objectPath.get(config.value, "toolbar.display")) {
      return;
    }

    this.bodyStore.addBodyClassname("toolbar-enabled");

    if (objectPath.get(config.value, "toolbar.fixed")) {
      this.bodyStore.addBodyClassname("toolbar-fixed");
    }

    this.bodyStore.addBodyClassname("toolbar-tablet-and-mobile-fixed");
  }

  /**
   * @description init sidebar
   */
  public static initSidebar(): void {
    // this.bodyStore.removeBodyClassName("sidebar-enabled");
    if (!objectPath.get(config.value, "sidebar.display")) {
      return;
    }
    // Enable Sidebar
    this.bodyStore.addBodyClassname("sidebar-enabled");
  }

  /**
   * @description init Aside
   */
  public static initAside(): void {
    // this.bodyStore.removeBodyClassName("sidebar-enabled");
    // console.log(this.bodyStore.getClasses("wrapper"));

    if (!objectPath.get(config.value, "aside.display")) {
      console.log("Aside disabled");
      this.bodyStore.customStyle("padding-left", "0px");
      return;
    }
    // Enable Sidebar
    this.bodyStore.customStyle("padding-left", "350px");
  }

  /**
   * @description init footer
   */
  public static initFooter(): void {
    // Fixed header
    if (objectPath.get(config.value, "footer.width") === "fixed") {
      this.bodyStore.addBodyClassname("footer-fixed");
    }
  }

  public static enableSidebar(): void {
    config.value.sidebar.display = true;
    // Enable Sidebar
    this.bodyStore.addBodyClassname("sidebar-enabled");
  }

  public static disableSidebar(): void {
    config.value.sidebar.display = false;

    // Disable Sidebar
    this.bodyStore.removeBodyClassName("sidebar-enabled");
  }

  public static enableAside(): void {
    config.value.aside.display = true;
    // Enable Aside
    this.bodyStore.customStyle("padding-left", "350px");
  }

  public static disableAside(): void {
    config.value.aside.display = false;

    // Disable Aside
    this.bodyStore.customStyle("padding-left", "0px");
  }

  public static emptyElementClassesAndAttributes(element: HTMLElement): void {
    element.className = "";
    for (let i = element.attributes.length; i-- > 0; )
      element.removeAttributeNode(element.attributes[i]);
  }
}

export default LayoutService;
