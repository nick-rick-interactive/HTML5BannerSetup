class Test_728x90 extends BannerCanvas

  init: () =>

    @clubSpeed = 0.4
    @els["blur_club"].filters = [new createjs.BlurFilter(24, 24, 2)]

    @setup();

    @phase1()

  setup: () =>

    console.log("setup");

    TweenMax.set(@els["cta"],{x:@OG["cta"].x-50});
    TweenMax.set(@els["boeing"],{x:@OG["boeing"].x-30});
    TweenMax.set(@els["blur_club"],{x:@OG["blur_club"].x-50,alpha:1});

    for i in [3..1]

      TweenMax.set(@els["txt_"+i],{x:0,alpha:1,scale:0.9})
      TweenMax.set(@els["scene_"+i],{x:0,alpha:1})

      @els["scene_"+i+"_mask"].cache(0,0,@els["scene_"+i+"_mask"].width,@els["scene_"+i+"_mask"].height)
      @els["scene_"+i].cache(0,0,@els["scene_"+i+"_mask"].width,@els["scene_"+i+"_mask"].height);
      @els["scene_"+i].mask = @els["scene_"+i+"_mask"];

      TweenMax.set(@els["scene_"+i+"_mask"],{x:0,width:@OG["scene_"+i+"_mask"].width,alpha:1})

    TweenMax.set(@els["club"],{x:@OG["club"].x-50,alpha:1});

  phase1: () =>

    console.log("phase1");

    TweenMax.set(@els["blur_club"],{x:0});

    TweenMax.to(@els["txt_1"],1,{x:0,delay:0.1,scale:1});
    TweenMax.to(@els["scene_1_mask"],@clubSpeed-0.1,{width: @width,delay:0.1,ease:"Linear.easeNone"});

    TweenMax.to(@els["blur_club"],@clubSpeed,{x:(@width*2)+50,ease:"Linear.easeNone"});

    @switchFunc(@phase2,2.5);

  phase2: () =>

#reset from repeat
    TweenMax.set(@els["txt_3"],{alpha:1});
    TweenMax.set(@els["scene_3"],{x:0,width:"0px",alpha:1});
    TweenMax.set(@els["club"],{x:200,alpha:1});

    TweenMax.set(@els["blur_club"],{x:0});

    TweenMax.to(@els["txt_1"],@clubSpeed,{ease:"Linear.easeNone"});
    TweenMax.to(@els["scene_1_mask"],@clubSpeed,{x:@width, width:0,ease:"Linear.easeNone"});

    TweenMax.to(@els["txt_2"],1,{x:0,delay:0.1,scale:1});
    TweenMax.to(@els["scene_2_mask"],@clubSpeed-0.1,{width:@width,delay:0.1,ease:"Linear.easeNone"});

    TweenMax.to(@els["boeing"],0.6,{x:0,alpha:1,delay:0.1});

    TweenMax.to(@els["blur_club"],@clubSpeed,{x:(@width*2)+50,ease:"Linear.easeNone"});

    @switchFunc(@phase3,2.5);

  phase3: () =>

    TweenMax.set(@els["blur_club"],{x:0});

    TweenMax.to(@els["txt_2"],@clubSpeed,{ease:"Linear.easeNone"});
    TweenMax.to(@els["scene_2_mask"],@clubSpeed,{x:@width, width:0,ease:"Linear.easeNone"});

    TweenMax.to(@els["txt_3"],0.5,{x:0,delay:0.3});
    TweenMax.to(@els["scene_3_mask"],@clubSpeed-0.1,{width:@width,delay:0.1,ease:"Linear.easeNone"});

    TweenMax.to(@els["club"],0.5,{x:@OG["club"].x,delay:0.2});

    TweenMax.to(@els["cta"],0.5,{x:@OG["cta"].x,alpha:1,delay:1});

    @els["cta"].addEventListener("mouseover",@ctaOver);
    @els["cta"].addEventListener("mouseout",@ctaOut);

    TweenMax.to(@els["blur_club"],@clubSpeed,{x:(@width*2)+50,ease:"Linear.easeNone"});

    @switchFunc(@finish,3.5);

  finish: () =>

    if @curLoop==@loop

#/// END NO ANIMATION ///

      @end(@init)

    else

#/// END WITH ANIMATION ///

#example
      TweenMax.to(@els["boeing"],0.3,{alpha:0,x:20});
      TweenMax.to(@els["cta"],0.3,{alpha:0,x:20,onComplete:()=>

        @end(@preLoop,0,["txt_3","scene_3","club"])

      })

  preLoop: () =>

    @setup();

    console.log("postsetup");

    @els["cta"].removeEventListener("mouseover",@ctaOver);
    @els["cta"].removeEventListener("mouseout",@ctaOut);

    TweenMax.set(@els["txt_3"],{x:@OG["txt_3"].x});
    TweenMax.set(@els["scene_3"],{width:@width});
    TweenMax.set(@els["club"],{x:@OG["club"].x});

    TweenMax.to(@els["txt_3"],@clubSpeed,{});
    TweenMax.to(@els["club"],@clubSpeed,{x:-@width});
    TweenMax.to(@els["scene_3"],@clubSpeed,{x:@width, width:0});

    @phase1();

  ctaOver: () =>

    TweenMax.to(@els["cta"],0.2,{x:3});

  ctaOut: () =>

    TweenMax.to(@els["cta"],0.2,{x:0});


banner = ""

$(document).ready ->

  # Change name here too
  banner = new Test_728x90 728, 90, "in-page", 3