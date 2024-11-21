import React from "react";
import BreadCrumb from "../components/BreadCrumb";
import Meta from "../components/Meta";
import Container from "../components/Container";
import logo from "../assets/Logo_Sac.png";

const PrivacyPolicy = () => {
  return (
    <>
      <Meta title={"Chính Sách Bảo Hành Thời Trang"} />
      <BreadCrumb title="Chính Sách Bảo Hành Thời Trang" />
      <Container class1="policy-wrapper py-5 home-wrapper-2">
        <div className="row">
          <div className="col-12">
            <div className="policy">
              <img
                src={logo}
                alt="Logo"
                style={{
                  maxWidth: "200px",
                  display: "block",
                  margin: "0 auto 20px auto"
                }}
              />
              <h1>Chính Sách Bảo Hành Thời Trang</h1>

              <h2>1) Bảo Hành 12 Tháng</h2>
              <p>
                - Áp dụng cho các sản phẩm thời trang như quần áo, giày dép, phụ kiện thời trang, túi xách, v.v.<br />
                - Sản phẩm sẽ được bảo hành trong 12 tháng kể từ ngày mua đối với lỗi từ nhà sản xuất (chất liệu, đường may, phụ kiện kèm theo).<br />
                - Sản phẩm không được bảo hành trong trường hợp bị hư hỏng do sử dụng sai cách, giặt giũ không đúng cách hoặc tác động từ bên ngoài.
              </p>

              <h2>2) Chính Sách Đổi Hàng</h2>
              <p>
                - Đổi sản phẩm trong vòng 15 ngày kể từ ngày mua nếu sản phẩm bị lỗi từ nhà sản xuất hoặc không đúng kích cỡ/kiểu dáng như yêu cầu.<br />
                - Không áp dụng đổi trả đối với các sản phẩm đã qua sử dụng, đã giặt hoặc đã có dấu hiệu hư hỏng do tác động bên ngoài.
              </p>

              <h3>2.1) Đổi sản phẩm thời trang</h3>
              <p>
                - Đổi sản phẩm trong 7 ngày đầu tiên: miễn phí.<br />
                - Đổi sản phẩm trong 8 đến 15 ngày: thu phí đổi hàng 10% giá trị hóa đơn.
              </p>

              <h3>2.2) Chính Sách Đổi Kích Cỡ</h3>
              <p>
                - Nếu sản phẩm không phù hợp với kích cỡ bạn chọn, bạn có thể đổi sang kích cỡ khác trong vòng 7 ngày đầu tiên (phụ thuộc vào sự có sẵn của kích cỡ tại cửa hàng).<br />
                - Phí vận chuyển đổi hàng sẽ do khách hàng chịu nếu sản phẩm được gửi lại từ xa.
              </p>

              <h2>3) Hoàn Tiền</h2>
              <p>
                - Hoàn tiền trong vòng 7 ngày đầu tiên nếu sản phẩm có lỗi từ nhà sản xuất hoặc không đúng mẫu mã/kích cỡ.<br />
                - Sau 7 ngày, khách hàng sẽ được đổi sản phẩm nhưng không được hoàn tiền, trừ khi sản phẩm bị lỗi từ nhà sản xuất.
              </p>

              <h3>3.1) Hoàn tiền đối với sản phẩm lỗi</h3>
              <p>
                - Thực hiện hoàn tiền trong vòng 7 ngày đầu tiên kể từ ngày mua đối với các sản phẩm có lỗi do nhà sản xuất (đường may hỏng, vải bị rách, nút áo bị hỏng...).
              </p>

              <h3>3.2) Hoàn tiền đối với sản phẩm không lỗi</h3>
              <p>
                - Hoàn tiền trong vòng 7 ngày đầu tiên với mức phí hoàn tiền 20% giá trị hóa đơn đối với sản phẩm không lỗi, không phù hợp yêu cầu của khách hàng (chất liệu, kiểu dáng, v.v.).
              </p>

              <h2>4) Điều Kiện Đổi Hàng/Hoàn Tiền</h2>
              <p>
                - Sản phẩm phải giữ nguyên hình dạng ban đầu, không có dấu hiệu sử dụng hoặc làm hư hỏng (như vết bẩn, vết nhăn, hoặc vết xước).<br />
                - Sản phẩm phải có tem, nhãn mác đầy đủ, không bị mất hộp, bao bì (nếu có).
              </p>

              <p>Chúng tôi cam kết mang đến những sản phẩm chất lượng và dịch vụ bảo hành tận tâm để đảm bảo sự hài lòng của bạn.</p>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
};

export default PrivacyPolicy;
