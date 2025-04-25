import { S3 } from "aws-sdk";

export const calclateBuildingVal = (detail) => {
  let att_num = 0;
  let area_num = 0;
  let qty_num = 0;

  if (detail?.u_facade) {
    att_num = att_num + 1;
  }
  if (detail?.u_windows) {
    att_num = att_num + 1;
  }
  if (detail?.u_doors) {
    att_num = att_num + 1;
  }
  if (detail?.u_roof) {
    att_num = att_num + 1;
  }
  if (detail?.u_foundation) {
    att_num = att_num + 1;
  }
  if (detail?.u_electricity) {
    att_num = att_num + 1;
  }
  if (detail?.u_heating) {
    att_num = att_num + 1;
  }
  if (detail?.u_heat_dist) {
    att_num = att_num + 1;
  }
  if (detail?.u_ventilation) {
    att_num = att_num + 1;
  }

  //debugger;
  att_num = (att_num / 9) * 100;

  if (detail?.area_bta) {
    area_num = area_num + 1;
  }
  if (detail?.area_bra) {
    area_num = area_num + 1;
  }
  if (detail?.area_boa) {
    area_num = area_num + 1;
  }
  if (detail?.area_loa) {
    area_num = area_num + 1;
  }
  if (detail?.area_a_temp) {
    area_num = area_num + 1;
  }

  area_num = (area_num / 5) * 100;

  if (detail?.no_of_windows) {
    qty_num = qty_num + 1;
  }
  if (detail?.no_of_light_fixtures) {
    qty_num = qty_num + 1;
  }
  if (detail?.no_of_balconies) {
    qty_num = qty_num + 1;
  }
  if (detail?.facade_area) {
    qty_num = qty_num + 1;
  }
  if (detail?.no_of_entrance_doors) {
    qty_num = qty_num + 1;
  }
  if (detail?.no_of_stairwells) {
    qty_num = qty_num + 1;
  }
  if (detail?.no_of_ventilation_units) {
    qty_num = qty_num + 1;
  }
  if (detail?.no_of_laundries) {
    qty_num = qty_num + 1;
  }
  if (detail?.no_of_light_posts) {
    qty_num = qty_num + 1;
  }
  if (detail?.no_of_doors) {
    qty_num = qty_num + 1;
  }
  if (detail?.no_of_charging_posts) {
    qty_num = qty_num + 1;
  }

  qty_num = (qty_num / 11) * 100;

  return {
    att_num: parseInt(att_num.toFixed(2)),
    area_num: parseInt(area_num.toFixed(2)),
    qty_num: parseInt(qty_num.toFixed(2)),
  };
};

export const generateRandomString = (length) => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  const charactersLength = characters.length;

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
};

export const uploadFile = (file, callback) => {
  try {
    const s3bucket = new S3({
      accessKeyId: "",
      secretAccessKey: "",
      Bucket: "",
      signatureVersion: "v4",
      ACL: "public-read",
      region: "",
      successActionStatus: 201,
    });
    // create a bucket

    const fileType = file.type;
    const fileExtension = file.name.split(".").pop();

    s3bucket.createBucket(() => {
      s3bucket.upload(
        {
          Bucket: "",
          Key: file?.name ? file?.name : "Audit Result",
          Body: file,
          ContentType: fileType,
          ACL: "public-read",
          region: "",
          successActionStatus: 201,
        },
        (err, data) => {
          if (err) {
            console.log(err, "err", data);
            return;
          }
          if (data) {
            callback(data, fileExtension);
          }
        }
      );
    });
  } catch (error) {
    console.log(error);
  }
};
