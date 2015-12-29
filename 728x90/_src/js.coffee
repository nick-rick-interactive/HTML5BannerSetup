class Banner728x90 extends Banner

  init: () =>
    console.log "init"

    TweenMax.set($("#words"),{opacity:2});
    TweenMax.set($(el),{transformPerspective:200,opacity:0,rotationX:90,y:0-($(el).height()/2)}) for el in @els
    @phase1()

  phase1: () =>
    console.log "phase1"
    TweenMax.to($("#clean"),0.3,{rotationX:0,opacity:1,y:0,ease:Back.easeOut})
    @switchFunc(@phase2,1.5);

  phase2: () =>
    console.log "phase2"
    TweenMax.to($("#clean"),0.3,{rotationX:-90,opacity:0,y:$("#clean").height()/2,ease:Back.easeIn})
    TweenMax.to($("#friendly"),0.3,{rotationX:0,opacity:1,y:0,ease:Back.easeOut,delay:0.3})
    @switchFunc(@phase3,1.5);

  phase3: () =>
    console.log "phase2"
    TweenMax.to($("#friendly"),0.3,{rotationX:-90,opacity:0,y:$("#friendly").height()/2,ease:Back.easeIn})
    TweenMax.to($("#fun"),0.3,{rotationX:0,opacity:1,y:0,ease:Back.easeOut,delay:0.3})
    @switchFunc(@phase4,1.5);

  phase4: () =>
    console.log "phase2"
    TweenMax.to($("#fun"),0.3,{rotationX:-90,opacity:0,y:$("#fun").height()/2,ease:Back.easeIn})
    TweenMax.to($("#price"),0.3,{rotationX:0,opacity:1,y:0,ease:Back.easeOut,delay:0.3})
    @switchFunc(@phase5,1.5);

  phase5: () =>
    console.log "phase2"
    TweenMax.to($("#price"),0.3,{rotationX:-90,opacity:0,y:$("#price").height()/2,ease:Back.easeIn})
    TweenMax.to($("#start"),0.3,{rotationX:0,opacity:1,y:0,ease:Back.easeOut,delay:0.3})
    @switchFunc(@finish,3);

  finish: () =>
    console.log "end"
    if @curLoop==@loop
      @end(@init)
    else
      TweenMax.to($("#start"),0.3,{rotationX:-90,opacity:0,y:$("#start").height()/2,ease:Back.easeIn,delay:0.3,onComplete:()=>
        @end(@init)
      })



banner = ""
$(document).ready ->
  banner = new Banner728x90 728, 90, 3