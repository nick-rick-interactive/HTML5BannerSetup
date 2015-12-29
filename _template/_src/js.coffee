# Change class name to match banner size.
# i.e. Banner728x90
class BannerNew extends Banner

  init: () =>
    console.log "init"

    #SETUP ASSETS
    @phase1()

  phase1: () =>
    console.log "phase1"
    #FIRST ANIMATION
    @switchFunc(@phase2,1.5);

  finish: () =>
    console.log "end"
    if @curLoop==@loop

      #END NO ANIMATION
      @end(@init)
    else

      #END WITH ANIMATION
      TweenMax.to($("#start"),0.3,{rotationX:-90,opacity:0,y:$("#start").height()/2,ease:Back.easeIn,delay:0.3,onComplete:()=>

        @end(@init)
      })



banner = ""
$(document).ready ->

  # Change name here too
  banner = new BannerNew 728, 90, 3