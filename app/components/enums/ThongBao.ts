export enum ThongBao {
  login = "Đăng nhập thành công",
  loginTB = "Đăng nhập thất bại",
  KhongCoQuyen = "Không có quyền truy cập chức năng này",
  VuiLongDangNhap = "Vui lòng đăng nhập để sử dụng chức năng này",
  ThemMoi = "Thêm mới thành công",
  Sua = "Sửa bản ghi thành công",
  xoa = "Xóa thành công",
  CapNhatThanhCong = "Cập nhật thành công",
}
export enum TypeToast {
  Success = "success",
  Error = "error",
  Info = "info",
  Warning = "warning",
}
export enum dsChucNang {
  donvi = 1,
  nhomquyen = 2,
}

export enum dsDoiTuong {
  DM_DANHMUC = "DM_DANHMUC",
  HT_NGUOIDUNG = "HT_NGUOIDUNG",
}
export enum varVaiTro {
  quantrihethong = 1,
  quantridonvi = 2,
}
export const dsKieuDuLieu = [
  { ID: "string", TEN: "Văn bản" },
  { ID: "number", TEN: "Số" },
  { ID: "date", TEN: "Ngày tháng" },
  { ID: "datetime", TEN: "Ngày giờ" },
  { ID: "boolean", TEN: "Đúng/Sai" },
  { ID: "file", TEN: "Tệp tin" },
  { ID: "danhmuc", TEN: "Danh mục" },
  { ID: "textarea", TEN: "Văn bản dài" },
  { ID: "html", TEN: "Văn bản html" },
  { ID: "table", TEN: "Bảng dữ liệu" },
];
export const dsSoThapPhan = [
  { ID: "0", TEN: "0 số" },
  { ID: "1", TEN: "1 số" },
  { ID: "2", TEN: "2 số" },
  { ID: "3", TEN: "3 số" },
  { ID: "4", TEN: "4 số" },
];
