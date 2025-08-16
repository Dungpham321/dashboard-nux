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
