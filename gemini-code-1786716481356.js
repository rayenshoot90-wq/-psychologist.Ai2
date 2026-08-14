import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { message } = await req.json();

    if (!message || !message.trim()) {
      return NextResponse.json({ error: 'الرجاء كتابة رسالة' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    // في حال عدم إضافة المفتاح في Vercel، يقدم النظام رداً تجريبياً وداقماً
    if (!apiKey) {
      const text = message.toLowerCase();
      let reply = "أنا هنا لأسماعك والتحديث معك. يمكنك مشاركتي المزيد عما يدور به أفكارك اليوم.";

      if (text.includes("متعب") || text.includes("حزين") || text.includes("ضغوط")) {
        reply = "أشعر بك، من الطبيعي أن نمر بأوقات نقتطع فيها طاقة كبيرة وتصيبنا بالإرهاق. لا تحمّل نفسك أكثر من طاقتها، وأنا هنا إذا أردت التفريغ والتحدث أكثر.";
      } else if (text.includes("مرحبا") || text.includes("أهلا") || text.includes("السلام")) {
        reply = "أهلاً بك! سعيد بحديثك معي اليوم. كيف كان يومك وكيف تشعر الآن؟";
      } else if (text.includes("شكرا") || text.includes("يعطيك العافية")) {
        reply = "على الرحب والسعة دائماً! أتمنى لك يوماً أهدأ وأجمل، وأنا موجود في أي وقت تحتاج فيه للحديث.";
      } else if (text.includes("نصيحة") || text.includes("ماذا أفعل")) {
        reply = "أفضل نقطة للبدء هي أن تأخذ نفساً عميقاً، وتفرّق بين الأشياء التي يمكنك التحكم بها والأنشطة التي تخرج عن إرادتك. خذ استراحة قصيرة وخطوة واحدة صغيرة كل مرة.";
      }

      return NextResponse.json({ reply });
    }

    // طلب المعالجة المباشرة من Gemini API عند توفر المفتاح
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: `أنت مساعد ذكي مستمع وداعم نفسياً. تحدث بأسلوب هادئ، متعاطف، ومشجع باللغة العربية. استمع لحديث المستخدم وساعده على إعادة تنظيم أفكاره والتخفيف من التوتر. لا تقدم تشخيصات طبية جازمة، وأكد عند الحاجة على أهمية استشارة مختص بشرى. رسالة المستخدم هي: "${message}"`
              }
            ]
          }
        ]
      })
    });

    const data = await response.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "أنا هنا لاستماعك، كيف يمكنني دعمك أكثر في هذا الأمر؟";

    return NextResponse.json({ reply });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'حدث خطأ أثناء معالجة الطلب' }, { status: 500 });
  }
}