using Microsoft.AspNetCore.Mvc;

using Newtonsoft.Json;

using StyleSamples.ViewModel;

using System.Collections;

using System.Collections.Generic;

using System.IO;

using System.Linq;



namespace StyleSamples.Controllers

{

    public class SamplesController : Controller

    {

        private const string pathFile = @"..\StylesSamples\DatabaseJson\devices.json";



        public IActionResult Index()

        {

            return View();

        }



        [HttpGet]

        public JsonResult JsonReaderDevice(bool showByArea = false)

        {

            var serializer = new JsonSerializer();

            using (var fs = new FileStream(pathFile, FileMode.Open, FileAccess.Read))

            using (var sr = new StreamReader(fs))

            {

                using (var jsonTextReader = new JsonTextReader(sr))

                {

                    var listDevices = serializer.Deserialize<IList<Device>>(jsonTextReader);



                    if (showByArea)

                    {

                        var listDevicesByArea = listDevices.GroupBy(

                            x => x.area,

                            x => x,

                            (_area, g) => new { area = _area, devices = g.ToList() }

                            );

                        return Json(listDevicesByArea);

                    }



                    return Json(listDevices);

                }



            }

        }



    }

}



