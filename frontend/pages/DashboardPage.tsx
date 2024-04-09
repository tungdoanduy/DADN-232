import weatherScreen from '@fe/assets/weather-screen.png';
import { AppNavigationBar, LineChart, MiniDeviceInfo, RadioChart } from '@fe/components';
import { useDevicesStore } from '@fe/states';
import { ChevronDoubleLeftIcon, ChevronDoubleRightIcon } from '@heroicons/react/24/outline';
import { Carousel, IconButton, Typography } from '@material-tailwind/react';
import moment from 'moment';
import { FaTemperatureHigh } from 'react-icons/fa';
import { ComponentSkeleton } from '@fe/components';
import { useEffect, useState } from 'react';
export function DashboardPage() {
    const time = moment().format('HH:mm');
    const day = moment().format('DD/MM/YYYY');
    const [timer, setTimer] = useState<number>(9);
    useEffect(() => {
        const interval = setInterval(() => {
            setTimer((prev) => (prev - 1 < 0 ? 9 : prev - 1));
        }, 1000);
        return () => clearInterval(interval);
    }, []);
    const { deviceInfos } = useDevicesStore();
    return (
        <>
            <AppNavigationBar title={'Dashboard'} />
            <div className='px-8 py-6 bg-white/2 dark:text-white/2 dark:bg-gray-700'>
                {deviceInfos.length === 0 ? (
                    <ComponentSkeleton />
                ) : (
                    <div className='min-h-screen w-full flex flex-col md:flex-row gap-10 md:justify-between'>
                        <div className='flex flex-col gap-4 lg:w-[480px] xl:w-[680px] flex-grow'>
                            <div
                                style={{
                                    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), url(${weatherScreen})`,
                                    backgroundSize: 'cover',
                                    backgroundRepeat: 'no-repeat',
                                    backgroundPosition: 'center'
                                }}
                                className='flex flex-col justify-between lg:h-[200px] xl:h-[250px] rounded-3xl p-4'
                            >
                                <div className='flex flex-row-reverse'>
                                    <div className='flex flex-col w-[300px] items-end gap-2'>
                                        <div className='flex items-center gap-4'>
                                            <Typography className='text-white font-semibold text-lg' placeholder={undefined}>
                                                {day}
                                            </Typography>
                                            <Typography className='text-white font-semibold text-lg' placeholder={undefined}>
                                                {time}
                                            </Typography>
                                        </div>
                                        <div className='flex items-center gap-2 '>
                                            <Typography className='text-white text-3xl font-semibold' placeholder={undefined}>
                                                {deviceInfos.filter((device) => device.deviceType === 'temperature')[0]?.lastValue}
                                            </Typography>
                                            <FaTemperatureHigh className='text-4xl text-white' />
                                        </div>
                                    </div>
                                </div>
                                <div className='flex'>
                                    <div className='flex flex-col text-center w-[300px]'>
                                        <Typography className='text-lg font-semibold text-white' placeholder={undefined}>
                                            Xin chào, Minh Tuệ
                                        </Typography>
                                        <Typography className='text-sm text-white' placeholder={undefined}>
                                            Thời tiết hiện tại ở trang tại là{' '}
                                            {deviceInfos.filter((device) => device.deviceType === 'temperature')[0]?.lastValue}°C
                                        </Typography>
                                        <Typography className='text-sm text-white' placeholder={undefined}>
                                            Hãy dành chút thời gian để xem thông tin cảm biến và chăm sóc trang trại của bạn nhé!
                                        </Typography>
                                    </div>
                                </div>
                            </div>
                            <div className='w-full'>
                                <Carousel
                                    placeholder={'Chưa có dữ liệu'}
                                    autoplay={true}
                                    autoplayDelay={10000}
                                    loop={true}
                                    prevArrow={({ handlePrev }) => (
                                        <IconButton
                                            placeholder={''}
                                            variant='text'
                                            color='white'
                                            size='lg'
                                            onClick={handlePrev}
                                            className='!absolute top-2/4 left-4 -translate-y-2/4'
                                        >
                                            <ChevronDoubleLeftIcon className='w-8 h-8 text-green/1' />
                                        </IconButton>
                                    )}
                                    nextArrow={({ handleNext }) => (
                                        <IconButton
                                            placeholder={''}
                                            variant='text'
                                            color='white'
                                            size='lg'
                                            onClick={handleNext}
                                            className='!absolute top-2/4 !right-4 -translate-y-2/4'
                                        >
                                            <ChevronDoubleRightIcon className='w-8 h-8 text-green/1' />
                                        </IconButton>
                                    )}
                                    navigation={({ setActiveIndex, activeIndex, length }) => (
                                        <div className='absolute bottom-4 left-2/4 z-50 flex -translate-x-2/4 gap-2'>
                                            {new Array(length).fill('').map((_, i) => (
                                                <span
                                                    key={i}
                                                    className={`block h-1 cursor-pointer rounded-2xl transition-all content-[''] ${
                                                        activeIndex === i ? 'w-8 bg-green/1' : 'w-4 bg-gray-300'
                                                    }`}
                                                    onClick={() => setActiveIndex(i)}
                                                />
                                            ))}
                                        </div>
                                    )}
                                    transition={{ duration: 1 }}
                                    className='overflow-y-hidden bg-white dark:bg-gray-700 dark:text-white/2 rounded-3xl py -4 shadow-lg'
                                >
                                    <LineChart
                                        deviceInfos={deviceInfos.filter((device) => device.deviceType === 'temperature')}
                                        time='minute'
                                    />
                                    <LineChart
                                        deviceInfos={deviceInfos.filter((device) => device.deviceType === 'airhumidity')}
                                        time='minute'
                                    />
                                    <LineChart
                                        deviceInfos={deviceInfos.filter((device) => device.deviceType === 'earthhumidity')}
                                        time='minute'
                                    />
                                    <LineChart deviceInfos={deviceInfos.filter((device) => device.deviceType === 'light')} time='minute' />
                                </Carousel>
                            </div>
                            <RadioChart deviceInfos={deviceInfos} />
                            {/* <Menu>
                             <MenuHandler>
                                 <IconButton placeholder={''} className='px-3 py-2 bg-green/1 '>
                                     <AdjustmentsHorizontalIcon className='w-6 h-6' />
                                 </IconButton>
                             </MenuHandler>
                             <MenuList placeholder={''}>
                                 <MenuItem placeholder={''}>Phút</MenuItem>
                                 <MenuItem placeholder={''}>Giờ</MenuItem>
                                 <MenuItem placeholder={''}>Ngày</MenuItem>
                                 <MenuItem placeholder={''}>Tuần</MenuItem>
                                 <MenuItem placeholder={''}>Tháng</MenuItem>
                             </MenuList>
                         </Menu> */}
                        </div>

                        <div className='flex flex-col items-center gap-4'>
                            <div
                                className="className='h-[300px] md:w-[250px] md:h-[200px] md:min-h-[200px] rounded-2xl bg-blue-gray-800 text-white flex justify-center flex-col items-center py-4 '
"
                            >
                                <Typography className='text-lg font-semibold text-center' placeholder={undefined}>
                                    Dữ liệu sẽ được cập nhật sau
                                </Typography>
                                <Typography className='text-lg font-semibold' placeholder={undefined}>
                                    {timer} giây
                                </Typography>
                            </div>
                            {deviceInfos
                                .filter((device) => device.deviceType !== 'led' && device.deviceType !== 'waterpump')
                                .map((device, index) => (
                                    <MiniDeviceInfo key={index} {...device} />
                                ))}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
