export function hideGridHeader(gridRef: any) {
  const gridInstance = gridRef.instance;
  if (!gridInstance) return;
  gridInstance.option("groupPanel.visible", false);
  gridInstance.option("filterRow.visible", false);
  gridInstance.option("filterPanel.visible", false); // tùy bạn
  gridInstance.option("headerFilter.visible", false);
  gridInstance.option("searchPanel.visible", false);
  gridInstance.option("export.enabled", false);
  gridInstance.option("onToolbarPreparing", (e: any) => {
    e.toolbarOptions.items = [];
  });
}
export function isTreeList(TreeRef: any) {
  const TreeInstance = TreeRef.instance;
  if (!TreeInstance) return;
  TreeInstance.option("onRowClick", (e: any) => {
    var length = e.component.getSelectedRowsData().length;
    if (length <= 1) e.component.clearSelection();
    if (!e.isSelected) {
      e.component.selectRows(e.key, true);
      console.log(e);
    } else {
      e.component.deselectRows(e.key);
    }
  });
}
export function convertToKey(str: string): string {
  return str?.trim().toLowerCase().replace(/\s+/g, "_") ?? "";
}
