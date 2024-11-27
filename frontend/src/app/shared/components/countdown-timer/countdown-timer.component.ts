import { Component, Input, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-countdown-timer',
  templateUrl: './countdown-timer.component.html',
  styleUrls: ['./countdown-timer.component.css']
})
export class CountdownTimerComponent implements OnInit, OnDestroy {
  @Input() offerEndDate: string = ''; // إدخال تاريخ انتهاء العرض
  dest: number = 0; // التاريخ المستهدف
  countdown: { days: string, hours: string, minutes: string, seconds: string } = {
    days: '00',
    hours: '00',
    minutes: '00',
    seconds: '00'
  }; // إعداد العد التنازلي
  intervalId: any; // معرف الـ interval

  constructor(private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    if (this.offerEndDate) {
      this.dest = new Date(this.offerEndDate).getTime(); // تعيين التاريخ المستهدف من المدخل
      this.startCountdown(); // بدء العد التنازلي عند تهيئة المكون
    }
  }

  startCountdown(): void {
    this.intervalId = setInterval(() => {
      const now = new Date().getTime();
      const diff = this.dest - now;

      // تحقق مما إذا كان العد التنازلي قد وصل إلى الصفر
      if (diff <= 0) {
        clearInterval(this.intervalId); // إيقاف العد
        this.countdown = { days: '00', hours: '00', minutes: '00', seconds: '00' }; // عرض الصفر
        return;
      }

      // حساب الأيام والساعات والدقائق والثواني
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      // تحديث القيم في الشكل الصحيح
      this.countdown = {
        days: this.pad(days),
        hours: this.pad(hours),
        minutes: this.pad(minutes),
        seconds: this.pad(seconds)
      };

      this.cdr.detectChanges(); // إشعار Angular بالتغييرات
    }, 1000); // تحديث كل ثانية
  }

  pad(value: number): string {
    return value < 10 ? `0${value}` : `${value}`; // إضافة صفر إذا كانت القيمة أقل من 10
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId); // إيقاف العد عند تدمير المكون
    }
  }
}
